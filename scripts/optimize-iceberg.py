#!/usr/bin/env python3
"""Resize embedded GLB textures without changing the geometry or UVs.
Usage: python scripts/optimize-iceberg.py ORIGINAL.glb public/models/iceberg-web.glb
Requires Pillow: python -m pip install pillow
"""
import io
import json
import os
import struct
import sys
from PIL import Image

if len(sys.argv)!=3: raise SystemExit("Usage: optimize-iceberg.py SOURCE.glb OUTPUT.glb")
src,dest=sys.argv[1:]
with open(src,"rb") as f:
    magic,version,_=struct.unpack("<III",f.read(12))
    if magic!=0x46546c67 or version!=2: raise ValueError("Input must be GLB v2")
    length,chunk=struct.unpack("<II",f.read(8))
    if chunk!=0x4e4f534a: raise ValueError("Expected JSON chunk")
    doc=json.loads(f.read(length))
    length,chunk=struct.unpack("<II",f.read(8))
    if chunk!=0x004e4942: raise ValueError("Expected BIN chunk")
    blob=f.read(length)
views=doc["bufferViews"]
geometry_end=max(v.get("byteOffset",0)+v["byteLength"] for v in views[:4])
binary=bytearray(blob[:geometry_end])
updated=[dict(v) for v in views[:4]]
for i,image in enumerate(doc["images"]):
    v=views[image["bufferView"]]
    raw=blob[v.get("byteOffset",0):v.get("byteOffset",0)+v["byteLength"]]
    with Image.open(io.BytesIO(raw)) as pic:
        pic=pic.convert("RGB")
        pic.thumbnail(((1536 if i==1 else 1024),)*2,Image.Resampling.LANCZOS)
        mem=io.BytesIO()
        pic.save(mem,format="JPEG",quality=(84 if i==1 else 79),subsampling=(0 if i==1 else 2),optimize=True)
        data=mem.getvalue()
    start=len(binary)
    binary.extend(data)
    binary.extend(b"\0"*((-len(binary))%4))
    updated.append({"buffer":0,"byteOffset":start,"byteLength":len(data)})
    image["bufferView"]=len(updated)-1
    image["mimeType"]="image/jpeg"
doc["bufferViews"]=updated
doc["buffers"]=[{"byteLength":len(binary)}]
for mat in doc.get("materials",[]):
    spec=mat.get("extensions",{}).get("KHR_materials_specular")
    if spec and "specularColorFactor" in spec:
        spec["specularColorFactor"]=[min(1,max(0,float(x))) for x in spec["specularColorFactor"]]
json_bytes=json.dumps(doc,separators=(",",":")).encode()
json_bytes+=b" "*((-len(json_bytes))%4)
with open(dest,"wb") as f:
    f.write(struct.pack("<III",0x46546c67,2,12+8+len(json_bytes)+8+len(binary)))
    f.write(struct.pack("<II",len(json_bytes),0x4e4f534a)); f.write(json_bytes)
    f.write(struct.pack("<II",len(binary),0x004e4942)); f.write(binary)
print(f"Optimized {os.path.getsize(src)/1e6:.2f}MB -> {os.path.getsize(dest)/1e6:.2f}MB")

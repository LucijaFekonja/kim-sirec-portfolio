import os 
import json

path = "photos"
img_list = list()

for root, dirs, files in os.walk(path):
    project_desc = None
    paths = []
    for name in files:
        if name.endswith((".jpg")):
            project_desc = ": ".join(root.split("\\")[1:])
            paths.append(os.path.join(root, name).replace("\\", "/")) # .replace("\\", "/")
            print(paths)
    
    if len(paths) > 0:
        cover = paths[0]
        img_dict = {
            "name": project_desc,
            "cover": cover,
            "images": paths
        }
        img_list.append(img_dict)

json_str = json.dumps(img_list, indent=4, ensure_ascii=False)
with open("gallery.json", "w", encoding='utf8') as f:
    f.write(json_str)
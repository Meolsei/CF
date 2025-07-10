# ─── Standard Libraries ─────────────────────────────
import os
import json

class userData():
    def __init__(self, file_path):
        self.file_path = file_path
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as f:
                json.dump({}, f)

    def load_data(self):
        with open(self.file_path, "r") as f:
            return json.load(f)
    
    def save_data(self, data):
        with open(self.file_path, "w") as f:
            json.dump(data, f, indent=4)
    
    def add_blocked_tag(self, user_id: str, tag: str):
        data = self.load_data()
        user_tags = data.get(user_id, {}).get("blocked_tags", [])

        if tag not in user_tags:
            user_tags.append(tag)
            if user_id not in data:
                data[user_id] = {}
            
            data[user_id]["blocked_tags"] = user_tags
            self.save_data(data)
            return True
        return False
    
    def get_blocked_tags(self, user_id: str):
        data = self.load_data()
        return data.get(user_id, {}).get("blocked_tags", [])
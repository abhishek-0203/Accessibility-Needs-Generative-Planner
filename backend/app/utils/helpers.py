from datetime import datetime

from bson.objectid import ObjectId


def serialize_doc(doc):
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, bytes):
            continue
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        elif isinstance(value, list):
            result[key] = [
                serialize_doc(item) if isinstance(item, dict) else
                str(item) if isinstance(item, ObjectId) else
                item.isoformat() if isinstance(item, datetime) else item
                for item in value
                if not isinstance(item, bytes)
            ]
        else:
            result[key] = value
    return result


def paginate(cursor, page, per_page):
    skip = (page - 1) * per_page
    items = list(cursor.skip(skip).limit(per_page))
    return items


def get_current_timestamp():
    return datetime.utcnow()

from datetime import datetime
from flask import  request, jsonify
from bson import ObjectId


def serialize_post(post):
    created = post.get('createdAt')
    if isinstance(created, datetime):
        created_str = created.isoformat() + 'Z'
    else:
        created_str = str(created)

    return {
        'id': str(post.get('id') or post.get('_id')),
        'userId': str(post.get('userId')) if post.get('userId') else None,
        'handle': post.get('handle', '@anon'),
        'text': post.get('text', ''),
        'tags': post.get('tags', []),
        'risk': post.get('risk', 'Low'),
        'createdAt': created_str,
        'likes': post.get('likes', 0),
        'comments': post.get('comments', 0),
    }

@app.route('/users/<user_id>/posts', methods=['POST'])
def create_post(user_id):
    # validate user
    try:
        oid = ObjectId(user_id)
    except Exception:
        return jsonify({'msg': 'Invalid user id'}), 400

    user = users_collection.find_one({'_id': oid})
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    body = request.json or {}
    text = (body.get('text') or '').strip()
    media = body.get('media') or []      # optional list of URLs
    tags = body.get('tags') or []        # optional list or string
    risk = body.get('risk') or 'Low'     # optional risk flag

    if isinstance(tags, str):
        # split by spaces/commas into array
        tags = [t.strip() for t in tags.replace(',', ' ').split() if t.strip()]

    if not text and not media:
        return jsonify({'msg': 'Post must have text or media'}), 400

    # object stored inside the USER document (keeps your current behavior)
    user_post = {
        'id': str(ObjectId()),
        'text': text,
        'media': media,
        'tags': tags,
        'risk': risk,
        'createdAt': datetime.utcnow().isoformat() + 'Z',
        'likes': 0,
        'comments': 0
    }

    # separate document for the global posts collection (used by Explore)
    post_doc = {
        'userId': oid,
        'handle': user.get('username', '@anon'),
        'text': text,
        'media': media,
        'tags': tags,
        'risk': risk,
        'createdAt': datetime.utcnow(),  # real datetime for sorting in Mongo
        'likes': 0,
        'comments': 0
    }

    # push into user's posts (your old behavior)
    users_collection.update_one(
        {'_id': oid},
        {'$push': {'posts': {'$each': [user_post], '$position': 0}}}
    )

    # insert into global posts collection
    posts_collection.insert_one(post_doc)

    # return updated user
    user = users_collection.find_one({'_id': oid})
    return jsonify(serialize_user(user)), 201

    users_collection.update_one({'_id': oid}, {'$push': {'posts': {'$each':[post], '$position':0}}})
    user = users_collection.find_one({'_id': oid})
    return jsonify(serialize_user(user)), 201
@app.route('/explore', methods=['GET'])
def explore():
    """
    Returns posts + trending tags for the Explore page.
    Query params:
      - filter = trending | latest | critical
      - q      = search text
    """
    filter_type = request.args.get('filter', 'trending')
    q = (request.args.get('q') or '').strip()
    limit = int(request.args.get('limit', 30))

    mongo_query = {}

    # search by text / tags
    if q:
        mongo_query["$or"] = [
            {"text": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}},
        ]

    # only critical
    if filter_type == 'critical':
        mongo_query["risk"] = "Critical"

    # latest posts
    cursor = (
        posts_collection
        .find(mongo_query)
        .sort("createdAt", DESCENDING)
        .limit(limit)
    )
    posts = [serialize_post(p) for p in cursor]

    # trending tags
    pipeline = [
        {"$unwind": "$tags"},
        {"$match": mongo_query if q else {}},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    tag_cursor = posts_collection.aggregate(pipeline)
    trending = [
        {"tag": d["_id"], "count": d["count"], "volume": f"{d['count']} posts"}
        for d in tag_cursor
    ]

    return jsonify({
        "posts": posts,
        "trending": trending
    }), 200

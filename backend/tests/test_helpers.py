"""Unit tests for app.utils.helpers"""
import pytest
from datetime import datetime
from bson.objectid import ObjectId
from app.utils.helpers import serialize_doc, get_current_timestamp


class TestSerializeDoc:
    def test_serialize_objectid(self):
        oid = ObjectId()
        doc = {'_id': oid, 'name': 'Test'}
        result = serialize_doc(doc)
        assert result['_id'] == str(oid)
        assert isinstance(result['_id'], str)

    def test_serialize_datetime(self):
        now = datetime(2026, 4, 19, 12, 0, 0)
        doc = {'created_at': now}
        result = serialize_doc(doc)
        assert result['created_at'] == now.isoformat()

    def test_serialize_nested_dict(self):
        oid = ObjectId()
        doc = {'user': {'_id': oid, 'name': 'Alice'}}
        result = serialize_doc(doc)
        assert result['user']['_id'] == str(oid)

    def test_serialize_list_with_objectids(self):
        oid = ObjectId()
        doc = {'ids': [oid]}
        result = serialize_doc(doc)
        assert result['ids'] == [str(oid)]

    def test_serialize_list_with_dicts(self):
        oid = ObjectId()
        doc = {'items': [{'_id': oid, 'val': 1}]}
        result = serialize_doc(doc)
        assert result['items'][0]['_id'] == str(oid)

    def test_serialize_bytes_excluded(self):
        doc = {'password': b'hashed_bytes', 'name': 'Alice'}
        result = serialize_doc(doc)
        assert 'password' not in result
        assert result['name'] == 'Alice'

    def test_serialize_plain_values(self):
        doc = {'count': 42, 'active': True, 'label': 'hello'}
        result = serialize_doc(doc)
        assert result == {'count': 42, 'active': True, 'label': 'hello'}

    def test_serialize_none(self):
        assert serialize_doc(None) is None

    def test_serialize_empty_doc(self):
        assert serialize_doc({}) == {}

    def test_serialize_mixed_list(self):
        now = datetime(2026, 1, 1)
        oid = ObjectId()
        doc = {'items': [oid, now, 'plain', 42]}
        result = serialize_doc(doc)
        assert result['items'][0] == str(oid)
        assert result['items'][1] == now.isoformat()
        assert result['items'][2] == 'plain'
        assert result['items'][3] == 42


class TestGetCurrentTimestamp:
    def test_returns_datetime(self):
        ts = get_current_timestamp()
        assert isinstance(ts, datetime)

    def test_timestamp_is_recent(self):
        ts = get_current_timestamp()
        diff = (datetime.utcnow() - ts).total_seconds()
        assert abs(diff) < 2

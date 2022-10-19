# Items-API

> API which modifies an incoming JSON POST payload and returns a response.

## Documentation
- The payload is filtered, so only items with a count greater than 1 are returned.
- The thumbnail is a url selected from the payload item's list of logos no larger than 128x128 but no smaller than 64x64.

- Request: 
```javascript
{
	"payload": [
		{
			"name": "Molly",
			"count": 12,
			"logos": [{
				"size": "16x16",
				"url": "https://example.com/16x16.png"
			},{
				"size": "64x64",
				"url": "https://example.com/64x64.png"
			}]
		},
		{
			"name": "Dolly",
			"count": 0,
			"logos": [{
				"size": "128x128",
				"url": "https://example.com/128x128.png"
			},{
				"size": "64x64",
				"url": "https://example.com/64x64.png"
			}]
		},
		{
			"name": "Polly",
			"count": 4,
			"logos": [{
				"size": "16x16",
				"url": "https://example.com/16x16.png"
			},{
				"size": "64x64",
				"url": "https://example.com/64x64.png"
			}]
		}
	]
}
```
- Response: 
```javascript
{
	"response": [
		{
			"name": "Molly",
			"count": 12,
			"thumbnail": "https://example.com/64x64.png"
		},
		{
			"name": "Polly",
			"count": 4,
			"thumbnail": "https://example.com/64x64.png"
		}
	]
}

```

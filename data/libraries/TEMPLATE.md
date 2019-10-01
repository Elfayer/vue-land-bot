# Template

# Required fields

The `name`, `url` and `fields` fields are required.

# Types

- The `fields` field must be an array of strings and/or objects containing a `name` and a `value`.
- The `colour` field should be a hexadecimal colour, a named colour (e.g. `RED`), or `RANDOM`.
- The `icon` field is the filename (+ extension) of the icon in `assets/images/icons/`.
- The `author.avatar` field should optionally be the filename (+ extension) of the avatar in `assets/images/avatars/`.
- The `tags` field should be an array of strings containing arbitrary tags.

---

```json
{
  "name": "Example Library",
  "tagline": "Example Library solves your problems",
  "tags": ["ui", "component", "library", "material", "design"],
  "icon": "example-library.png",
  "colour": "RANDOM",
  "url": {
    "site": "https://www.example.com/example-library/site",
    "docs": "https://www.example.com/example-library/docs",
    "repo": "https://www.example.com/example-library/code",
    "bugs": "https://www.example.com/example-library/bugs"
  },
  "fields": [
    { "name": "Fast", "value": "Example Library is fast" },
    { "name": "Easy", "value": "Example Library is easy to use" },
    { "name": "Secure", "value": "Example Library is safe" },
    "Use Example Library today!"
  ],
  "author": {
    "name": "Example Author",
    "url": "https://www.example.com/users/example-author",
    "avatar": "example-author.png"
  }
}
```

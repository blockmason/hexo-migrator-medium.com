# Medium.com migrator

Migrate your blog from Medium.com to [Hexo].

## Install
Add this to your `package.json`
```json
"hexo-migrator-medium.com": "git@github.com:blockmason/hexo-migrator-medium.com.git",
```

## Usage

Execute the following command after installed. `username` is the `@username` of the medium account.

The `--alias` option populates the `alias` setting in the front-matter, for use with the [hexo-generator-alias](http://github.com/hexojs/hexo-generator-alias) module. This is useful
for generating redirects.

The `--linkonly` option removes the content of the post. Useful for linkonly blogs.

``` bash
$ hexo migrate medium <username> [--alias,--linkonly]
```

Forked From the RSS migrator by 
[Hexo]: http://zespia.tw/hexo

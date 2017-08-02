var FeedParser = require('feedparser'),
  async = require('async'),
  tomd = require('to-markdown').toMarkdown,
  request = require('request'),
  url = require('url'),
  fs = require('fs');

exports.registerMigrator = function (hexo) {
  hexo.extend.migrator.register('medium', function (args, callback) {
    var source = "https://medium.com/feed/"
    var username = args._.shift();

    if (!username) {
      var help = [
        'Usage: hexo migrate medium <username> [--alias, --linkonly]',
        '',
        'Ex. hexo migrate medium @blockmason',
        '',
        'Use --linkonly to discard content. Useful for link blogs.',
        'For more help, you can check the docs: https://github.com/blockmason/hexo-migrator-medium.com'
      ];

      console.log(help.join('\n'));
      return callback();
    }

    var log = hexo.log,
      post = hexo.post,
      untitledPostCounter = 0,
      stream;

    var url = source + username
    stream = request(url);

    log.i('Analyzing %s...', source);

    var feedparser = new FeedParser(),
      posts = [];

    stream.pipe(feedparser)
      .on('error', callback);

    feedparser.on('error', callback);

    feedparser.on('readable', function () {
      var stream = this,
        meta = this.meta,
        item;

      while (item = stream.read()) {

        if (!item.title) {
          untitledPostCounter += 1;
          var untitledPostTitle = "Untitled Post - " + untitledPostCounter
          item.title = untitledPostTitle;
          log.w("Post found but without any titles. Using %s", untitledPostTitle)
        } else {
          log.i('Post found: %s', item.title);
        }

        var newPost = {
          title: item.title,
          date: item.date,
          tags: item.categories,
          link: item.link,
          content: tomd(item.description)
        };

        if (args.alias) {
          newPost.alias = url.parse(item.link).pathname;
        }

        if (args.linkonly) {
          newPost.go_to_website = true;
        }

        posts.push(newPost);

      }
    });

    stream.on('end', function () {
      async.each(posts, function (item, next) {
        post.create(item, next);
      }, function (err) {
        if (err) return callback(err);

        log.w('%d posts did not have titles and were prefixed with "Untitled Post".', untitledPostCounter);
        log.i('%d posts migrated.', posts.length);
        callback();
      });
    });
  });
}

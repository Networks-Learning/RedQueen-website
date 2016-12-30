var feed_vis = function () {
    /* Visualize the feed of the user. */
    var feed_length = 10;
    var width = 100, height = 100;
    var tweet_height = height / (feed_length + 3), tweet_width = 50;
    var tweet_colors = {
        'user': '#1E90FF',
        'other': '#FF008B'
    };

    function tweet_flow(selection) {
        selection.each(function (tweet_list, i) {
            /* a tweet_list looks like the following:
             * [ { 'id': <number>, 'source': 'other' | 'user' } ]
             */
            var tweets = d3.select(this)
                           .selectAll('rect.tweet')
                           .data(tweet_list.slice(0, feed_length),
                                 function (tweet) { return tweet.id; });

            tweets.enter()
                .append('rect')
                .attr('class', 'tweet')
                .attr('x',
                    function (d, i) {
                        // If the source is 'user', enter from left, else from
                        // right.
                        return d.source === 'user' ? 0 : 100 - tweet_width / 2;
                    })
                .attr('y', 0)
                .attr('width', tweet_width / 2)
                .attr('height', tweet_height / 2)
                .attr('fill', function (d) { return tweet_colors[d.source]; })
                .attr('stroke', 'rgba(0, 0, 0, 0.25)')
                .attr('stroke-width', 0.5)
                .attr('opacity', 1e-6)
              .merge(tweets)
                .transition()
                .attr('x', (width - tweet_width) / 2) // Centers tweets
                .attr('y', function (d, i) { return tweet_height * (i + 1); })
                .attr('width', tweet_width)
                .attr('height', tweet_height)
                .attr('opacity', 1.0);

            tweets.exit()
                .transition()
                .attr('y', function (d, i) { return tweet_height * (i + 1); })
                .attr('opacity', 1e-6)
                .remove();
        });
    }

    tweet_flow.feed_length = function (_) {
        if (!arguments.length) return feed_length;
        feed_length = _;
        return tweet_flow;
    };

    return tweet_flow;
};

fetch('data/example1.json')
.then(function (resp) {
    return resp.json();
})
.then(function (json_data) {
    /* Need to run a timer and constantly update the visualization. */
    var tweet_flow = feed_vis();

    var tweets = [], id = 0;

    var feed_length = tweet_flow.feed_length();

    function update_randomly(tweets, id, elem_id) {
        var rand = Math.random();
        tweets.unshift({
            id: id,
            source: (rand < 0.25) ? 'user' : 'other'
        });
        id = id + 1;
        tweets = tweets.slice(0, feed_length);
        d3.select('#' + elem_id)
          .datum(tweets)
          .call(tweet_flow);

        if (id < 200) {
            setTimeout(function () { update_randomly(tweets, id, elem_id); },
                       Math.random() * 1000);
        }
    }

    update_randomly([], 0, 'feed-1-vis');
    update_randomly([], 0, 'feed-2-vis');
});



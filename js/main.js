var feed_vis = function () {
    /* Visualize the feed of the user. */
    var feed_length = 10;
    var tweet_height = 10, tweet_width = 50;
    var width = 100;
    var tweet_colors = {
        'our': 'steelblue',
        'other': 'lilac'
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
                        return d.source === 'user' ? 0 : 100;
                    })
                .attr('y', 0)
                .attr('width', tweet_width)
                .attr('height', tweet_height)
                .attr('fill', function (d) { return tweet_colors['d']; })
              .merge(tweets)
                .transition()
                .attr('x', (width - tweet_width) / 2) // Centers tweets
                .attr('y', function (d, i) { return tweet_height * (i + 1); });

            tweets.exit()
                .transition()
                .attr('y', function (d, i) { return tweet_height * (feed_length + 1); })
                .attr('opacity', 1e-6)
                .remove();
        });
    }

    tweet_flow.feed_length = function (_) {
        if (!arguments.length) return feed_length;
        feed_length = _;
        return tweet_flow;
    }

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

    var svg = d3.select("#redqueen-demo")
            .data(tweets)
            .call(tweet_flow);

    function update_randomly() {
        tweets.push({
            id: id,
            source: (Math.random() < 0.25) ? 'user' : 'other'
        });
        id = id + 1;
        tweets = tweets.slice(10);
        d3.select("#redqueen-demo")
                    .data([tweets])
                    .call(tweet_flow);

        setTimeout(update_randomly, 1000);
    }

    update_randomly();
});



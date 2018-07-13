const POSTS_URL = 'http://bitvizor.com/news/wp-json/wp/v2/posts';
const EVENTS_URL = 'http://bitvizor.com/news/blockchain-events/';
const NUM_ITEMS = 3;


let newsInstance = new Vue({
    el : '#eventContainer',
    data : {
      events : []
    },
    mounted : function() {
        this.getEvents();
    },
    methods : {
        getEvents: function () {
            let events = [];
            fetch(EVENTS_URL)
                .then(res => {return res.text()})
                .then(d => {

                    let dom = $(d);
                    dom.find('.vsel-meta-title').each((i,v)=>{

                        if(i < NUM_ITEMS) {
                            events.push({
                                title: v.innerHTML
                            })
                        }
                    });

                    dom.find('.vsel-image').each((i,v)=>{
                        if( i < NUM_ITEMS) {
                            events[i]['image'] = v.src;
                        }
                    });

                    this.events = events;

                });
        }
    }
});

let postsInstance = new Vue({
    el : '#newsContainer',
    data : {
      posts : []
    },
    mounted : function() {
     this.getPosts();
    },
    methods : {
        getPosts: function () {
            let imgRegex = /"(https?:\/\/.*\.(?:png|jpg|jpeg))"/i;

            let posts = [];

            fetch(POSTS_URL)
                .then(res => {return res.json()})
                .then(d => {
                    d.forEach(e => {
                        let imageLink = imgRegex.exec(e['content']['rendered']);
                        if (imageLink && imageLink[1].length > 0 && posts.length < NUM_ITEMS) {

                            posts.push({
                                title: e['title']['rendered'],
                                image: imageLink[1]
                            });
                        }
                        else {
                            this.posts = posts;
                        }

                    });

                });
        }
    }
});
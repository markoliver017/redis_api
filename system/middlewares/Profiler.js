const { Admin_Model } = require('../core/Admin_Model');
let time_exec = 0;

const profiler = (profilerEnabled) => {
    return (req, res, next) => {

        /* if profiler(false) in ther server the profiler
        *   will go to next middleware
        */
        if (!profilerEnabled) {
            return next();
        }

        /* it calculates the time execution of every routes */
        const start = new Date();
        res.on('finish', () => {
            time_exec = new Date() - start;
            console.log(`Request to ${req.originalUrl} took ${time_exec}ms`);
        });

        /* When method is post, it creates session to store post data,
        *   action/path, memory usage for post method
        */
        if(req.method === 'POST') {
            req.session.profiler = {
                post: req.body,
                method: req.method,
                memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                path: req.url
            }
        }

        /* if no post data executed or get method data is empty the profiler will not work */
        if(!req.session.profiler && Object.keys(req.query).length === 0) {
            return next();
        }

        /* This will triggered if there are res.rendered method in the controller..
        * on this code the original render stored on a variable including view(ejs), options(data pass to the view)
        * then it creates another res.render method and add the original render plus the new_html created.
         */
        const originalRender = res.render;
        res.render = async function (view, options) {
            try {
                const html = await new Promise((resolve, reject) => {
                        originalRender.call(this, view, options, (err, html) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(html);
                    });
                });

                /* Store the post data from created session and delete it on session */
                let post_method_data, post_method, post_memory, post_path;
                if(req.session.profiler) {
                    const { post, method, memory, path } = req.session.profiler;
                    post_memory = memory;
                    post_method_data = post;
                    post_method = method;
                    post_path = path;
                    delete req.session.profiler;
                }
                /* Add HTML/data to the end of the `html` string
                    note: the 'html' variable is the original rendered html
                */
                let newHtml = html +
                `<div style='padding: 50px; margin: 20px auto; border: 1px solid black; width: 50%; box-shadow: 1px 1px 2px black; text-align: center; overflow: hidden;'>
                    \n\t<h1 style='border: 1px solid black; padding-bottom: 15px; box-shadow: 0 4px 2px -2px gray;'>Profiler</h1>
                    \n\t<div>
                    \n\t\t<h4>URI String:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black;'>${post_path || req.url}</p>
                    \n\t</div>
                    \n\t<div>
                    \n\t\t<h4>HTTP METHOD:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black;'>${post_method || req.method}</p>
                    \n\t</div>
                    \n\t<div>
                    \n\t\t<h4>GET/POST Data:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black; overflow: auto;'>${JSON.stringify(post_method_data || req.query)}</p>
                    \n\t</div>
                    \n\t<div>
                    \n\t\t<h4>Session Data:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black; overflow: auto;'>${JSON.stringify(req.session)}</p>
                    \n\t</div>
                    \n\t<div>`;

                if(Admin_Model.query) {
                    newHtml += `\n\t\t<h4>Last SQL Query:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black; overflow: auto;'>${Admin_Model.query}</p>
                    \n\t</div>
                    \n\t<div>
                    \n\t\t<h4>Database Query Time:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black;'>${Admin_Model.query_time}ms</p>
                    \n\t</div>`;
                }    
                    newHtml += `\n\t<div>
                    \n\t\t<h4>Total Execution Time:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black;'>${time_exec}ms</p>
                    \n\t</div>
                    \n\t<div>
                    \n\t\t<h4>Memory Usage:</h4>
                    \n\t\t<p style='border-bottom: 1px dotted black;'>${post_memory || (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB</p>
                    \n\t</div>
                </div>`;
        
                /* Set the modified `html` string in the response object */
                res.send(newHtml);

            } catch (err) {
                next(err);
            }
        };
    
        next();

        
    }
};

  
module.exports = profiler;
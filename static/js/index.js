NProgress.configure({ parent: 'h1' });
NProgress.configure({ showSpinner: false });
NProgress.configure({ easing: 'ease', speed: 500 });

NProgress.start();
NProgress.inc(0.4);
setTimeout(() => {
    NProgress.done();
}, 5000);

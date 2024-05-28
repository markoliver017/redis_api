const flashMessages = (req, res, next) => {
    req.flash = {
        set: function(type, message) {
            req.session.flash = req.session.flash || {};
            req.session.flash[type] = message;
        },
        get: function(type) {
            const message = req.session.flash && req.session.flash[type];
            if (req.session.flash) {
                delete req.session.flash[type];
            }
            return message;
        }
    }
    
    next();
}

module.exports = flashMessages;
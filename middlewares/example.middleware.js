const validateSesion =  (req, res, next) => {
    console.log('Middleware 1: Validate session...');

    const validateSesion = true;

    if (!validateSesion){
        res.status(400).json({
            status: 'error',
            message: 'Invalid session',
        });
    }
    next();
};

const validateUserRole =  (req, res, next) => {
    console.log('Middleware 2: Validate user rol...');
    next();
};

const validateUserData =  (req, res, next)=> {
    console.log('Middleware 3: Validate user data...');
    next();
};

module.exports= {
    validateSesion,
    validateUserRole,
    validateUserData,
}
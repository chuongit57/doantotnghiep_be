const responseSuccess = (res, message, result) => {
    return res.status(200).json({
        success: true,
        result: result,
        message: message
    });
}

const responseError = (res, status, message) => {
    return res.status(status).json({
        success: false,
        message: message
    });
}

const responseErrorCatch = (res, e) => {
    return res.status(400).json({ Error: e.message })
}


module.exports = {
    responseSuccess,
    responseError,
    responseErrorCatch
};

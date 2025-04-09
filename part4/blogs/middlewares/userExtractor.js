const jwt = require("jsonwebtoken")

const userExtractor = (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    request.user = decodedToken
    next()
}

module.exports = userExtractor;
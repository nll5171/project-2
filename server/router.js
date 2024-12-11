const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // TO-DO: Add GET/POST requests
  app.get('/getHunts', controllers.Hunt.getHunts);
  app.get('/getUserHunts', mid.requiresLogin, controllers.Hunt.getUserHunts);

  app.get('/login', mid.requiresSecure, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassPage);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Hunt.makerPage);
  app.post('/makeHunt', mid.requiresLogin, controllers.Hunt.makeHunt);
  app.post('/makeItem', mid.requiresLogin, controllers.Item.makeItem);

  app.post('/setPremium', mid.requiresLogin, controllers.Account.enablePremium);

  // TO-DO: Add functionality for hunt submissions
  app.get('/getSubmissions', mid.requiresLogin, controllers.Submission.getSubmissions);
  app.post('/makeSubmission', mid.requiresLogin, controllers.Submission.makeSubmission);

  app.get('/isLoggedIn', controllers.Account.isLoggedIn);
  app.get('/getUserInfo', controllers.Account.getUserInfo);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

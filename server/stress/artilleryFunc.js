const generateGetRequestData = (userContext, events, done) => {
  // const listingID = 100;
  const listingID = Math.floor(Math.random() * 1000000) + 1;
  userContext.vars.listingID = listingID;
  return done();
};

module.exports = {
  generateGetRequestData,
}

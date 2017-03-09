var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var Navbar = require('./Navbar');
var MainContainer = require('./MainContainer');


var Home = React.createClass({
  render: function () {
    return (
      <div>
        <Navbar />
        <MainContainer>
          <div className="row">
              <div className="col-sm-6 col-sm-offset-3 margin-bottom-30">
                  <Link className="webapp-btn" to="/startAnnotationTask">
                      <p className="text-center">Wecome to Annotate ME</p>
                      <h3 className="text-center">Start</h3>
                  </Link>
              </div>
          </div>
        </MainContainer>
      </div>
    )
  }
});

module.exports = Home;
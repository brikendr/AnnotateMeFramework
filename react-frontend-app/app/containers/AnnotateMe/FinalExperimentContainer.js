var React = require('react');
var ReactRouter = require('react-router');
var Navbar = require('../../components/Navbar');
var MainContainer = require('../../components/MainContainer');


var FinalExperimentContainer = React.createClass({
  render: function () {
    return (
      <div>
        <Navbar />
        <MainContainer>
          <div className="row">
              <div className="col-sm-6 col-sm-offset-3 margin-bottom-30">
                  <a className="webapp-btn" href="https://goo.gl/forms/Qfc8eggL2EcHtGDA2" target="_blank">
                      
                      <h3 className="text-center">Thank You!</h3>
                      <p className="text-center">Take the Questionnaire!</p>
                  </a>
              </div>
          </div>
        </MainContainer>
      </div>
    )
  }
});

module.exports = FinalExperimentContainer;
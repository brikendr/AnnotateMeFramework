var React = require('react');
require('../../styles/animate.css');
var GameIntroContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleKeyPress(e) {
        if(e.ctrlKey && e.keyCode == 32) {
            this.context.router.push('/aboardIntro');
        }
    },
    componentWillMount:function(){
        document.addEventListener("keydown", this.handleKeyPress, false);
    },
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center animated fadeInDown" style={styles.centerIt}>
                    <div className="col-4">
                        <img className="display-img-center" src="app/assets/img/openeyes.jpeg" width="100%"/>
                    </div>
                </div>
                <div className="row justify-content-center margin-top-10">
                    <div className="col-4 text-center">
                        <h2 className="animated fadeInUp">Secret Word ?</h2>
                        <div className="form-group form-md-line-input has-success animated fadeInUp">
                            <input className="form-control input-lg" autoFocus id="form_control_1" placeholder="Type the secret word" type="text"/>
                            <label htmlFor="form_control_1"></label>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center margin-top-0 animated fadeInUp" >
                    <div className="col-4 text-center">
                        <p><span className="badge badge-info badge-roundless animated bounce infinite"> New ? </span> <strong>Press <span className="font-red-thunderbird sbold">Ctrl + Space</span></strong></p>
                    </div>
                </div>
            </div>
        );
    }
});
var styles = {
  centerIt: {
    marginTop: '20%'
  },
  disclaimerFooter: {
    display: 'block',
    margin: '0 auto'
}
}

module.exports = GameIntroContainer;
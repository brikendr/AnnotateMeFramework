var React = require('react'),
    PropTypes = React.PropTypes;

var BetModal = React.createClass({
    componentDidMount() {
        require('../../../styles/modalStyle.css');
    },
    render(){
        return (
        <div>
            <div className="modal-wrapper">
                <div className="modal">
                    <div className="head">
                    <a className="btn-close trigger" href="javascript:;"></a>
                    Hello THere
                    </div>
                    <div className="content">
                    This is the content
                    </div>
                </div>
            </div>
        </div>
    );
    }
});

BetModal.propTypes = {
  title: PropTypes.string.isRequired
};

module.exports = BetModal;
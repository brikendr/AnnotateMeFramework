var React = require('react');
var PropTypes = React.PropTypes;
var LoadingGIF = require('../assets/img/loading.gif')

var Loading = React.createClass({
    propTypes: {
        text: PropTypes.string,
        speed: PropTypes.number
    },
    getDefaultProps: function() {
        return {
            text: 'Loading',
            speed: 300
        };
    },
    getInitialState: function(){
        this.originalText = this.props.text;
        return {
            text: this.originalText
        }
    },
    render: function() {
        return (
            <div className="row">
                <img className="display-img-center" src={LoadingGIF} />
            </div>
        );
    }
});

var  styles = {
    container: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    content: {
        textAlign: 'center',
        position: 'absolute',
        width: '100%',
        marginTop: '30px',
        fontSize: '33px'
    }
};

module.exports = Loading;
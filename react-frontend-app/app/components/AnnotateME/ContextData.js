var React = require('react');
var PropTypes = React.PropTypes;
var ReactToolTip = require('react-tooltip');
var FancyContextDataWrapper = require('./FancyContextDataWrapper');
var ContextNoDataWrapper = require('./ContextNoDataWrapper');
var Portlet = require('./Portlet');


function mappCollocations(collocations) {
    const mappedCollocations = collocations.map(collocation => 
        <li className="mt-list-item" key={collocation.id}>
            <div className="list-item-content">
                <p data-tip={collocation.pos_json}>{collocation.collocation_json}</p> <ReactToolTip />
            </div>
        </li>
    );
    return mappedCollocations;
}

function mappNeighborEntities(entities) {
    const mappedEntities = entities.map(entity => 
        <li className="mt-list-item" key={entity.id}>
            <div className="list-item-content">
                <p>{entity.description}</p>
            </div>
        </li>
    );
    return mappedEntities;
}

function mappKeywords(keywords) {
    const mappedKeywords = keywords.map(keyword => 
        <li className="mt-list-item" key={keyword.id}>
            <div className="list-item-content">
                <p>{keyword.keyword}</p> <ReactToolTip />
            </div>
        </li>
    );
    return mappedKeywords;
}

function ContextData(props) {
    let bigrams = mappCollocations(props.collocations),
        entities = mappNeighborEntities(props.neighborEntities),
        keywords = mappKeywords(props.keywords);
    
    return (
        <Portlet size={3} bordered="bordered">
            <div className="mt-element-list">
                <div className="mt-list-head list-default blue-chambray">
                    <div className="list-head-title-container">
                        <h3 className="list-title uppercase sbold">Context Clues</h3>
                    </div>
                </div>
                <FancyContextDataWrapper containerName="Collocations-Bigrams" >
                    {bigrams.length > 0 
                    ?   bigrams
                    :   <ContextNoDataWrapper />
                    }
                </FancyContextDataWrapper>

                <FancyContextDataWrapper containerName="Neighbor Entities">
                    {entities.length > 0 
                    ?   entities
                    :   <ContextNoDataWrapper />
                    }
                </FancyContextDataWrapper>

                <FancyContextDataWrapper containerName="Topic (Document) Keywords">
                    {keywords.length > 0 
                    ?   keywords
                    :   <ContextNoDataWrapper />
                    }
                </FancyContextDataWrapper>
            </div>
        </Portlet>
        
    );
}


ContextData.propTypes = {
    collocations: PropTypes.array.isRequired,
    neighborEntities: PropTypes.array.isRequired,
    keywords: PropTypes.array.isRequired
}

module.exports = ContextData;
/**
 * @author Anthony Hughes
 */

window.onload = function () {
// The original JSON-LD
    var jsonLD = {
        "@context": {
            "alternativeLabel": "http://data.cochrane.org/ontologies/pico/alternativeLabel",
            "label": "http://data.cochrane.org/ontologies/pico/label",
            "broaderConcept": "http://data.cochrane.org/ontologies/pico/broaderConcept",
            "inConceptScheme": "http://data.cochrane.org/ontologies/pico/inConceptScheme"
        },
        "@graph": [
            {
                "@type": "http://data.cochrane.org/ontologies/pico/Drug",
                "label": "5 Ml Isoproterenol Hydrochloride 0.2 Mg/ml Prefilled Syringe",
                "broaderConcept": {
                    "label": "Respiratory System",
                    "@id": "http://data.cochrane.org/concept/21605007"
                },
                "@id": "http://data.cochrane.org/concept/42800317",
                "inConceptScheme": {
                    "label": "RxNorm",
                    "@id": "http://data.cochrane.org/scheme/8"
                }
            },
            {
                "@type": "http://data.cochrane.org/ontologies/pico/Drug",
                "label": "300 Actuat Isoproterenol Hydrochloride 0.16 Mg/actuat / Phenylephrine Bitartrate 0.24 Mg/actuat Metered Dose Inhaler",
                "broaderConcept": {
                    "label": "Sympathomimetics, Combos Excl. Corticosteroids",
                    "@id": "http://data.cochrane.org/concept/21605024"
                },
                "@id": "http://data.cochrane.org/concept/42800323",
                "inConceptScheme": {
                    "label": "RxNorm",
                    "@id": "http://data.cochrane.org/scheme/8"
                }
            },
            {
                "@type": "http://data.cochrane.org/ontologies/pico/Drug",
                "label": "300 Actuat Isoproterenol Sulfate 0.08 Mg/actuat Metered Dose Inhaler",
                "broaderConcept": {
                    "label": "Drugs For Obstructive Airway Diseases",
                    "@id": "http://data.cochrane.org/concept/21603248"
                },
                "@id": "http://data.cochrane.org/concept/42800325",
                "inConceptScheme": {
                    "label": "RxNorm",
                    "@id": "http://data.cochrane.org/scheme/8"
                }
            },
            {
                "@type": "http://data.cochrane.org/ontologies/pico/Drug",
                "label": "300 Actuat Isoproterenol Sulfate 0.08 Mg/actuat Metered Dose Inhaler [medihaler-iso]",
                "broaderConcept": {
                    "label": "Respiratory System",
                    "@id": "http://data.cochrane.org/concept/21605007"
                },
                "@id": "http://data.cochrane.org/concept/42800326",
                "inConceptScheme": {
                    "label": "RxNorm",
                    "@id": "http://data.cochrane.org/scheme/8"
                }
            },
            {
                "@type": "http://data.cochrane.org/ontologies/pico/Drug",
                "label": "Isoproterenol Hydrochloride 0.004 Mg/ml Injectable Solution",
                "broaderConcept": {
                    "label": "Drugs For Obstructive Airway Diseases",
                    "@id": "http://data.cochrane.org/concept/21603248"
                },
                "@id": "http://data.cochrane.org/concept/42800879",
                "inConceptScheme": {
                    "label": "RxNorm",
                    "@id": "http://data.cochrane.org/scheme/8"
                }
            }
        ]
    };
    //var test = {
    //    "nodes": [0, 1, 2, 3],
    //    "edges": [
    //        [0, 1, {weight: 1}],
    //        [1, 2, {weight: 2}],
    //        [2, 3, {weight: 3}]]};

    var edges = [];
    var nodes = [];
    var nodesHash = {};
    var springyGraph = new Springy.Graph();

    //Take full compacted JSON-LD and build the nodes and edges ready for springy.js
    transformJSONLDToSpringJSFormat(jsonLD);
    displaySpringy();

    function transformJSONLDToSpringJSFormat(someJSONLD) {
        //Get Graph from JSON LD
        var graph = someJSONLD["@graph"];
        //Collect unique nodes
        for (var i in graph) {
            processLDObjectForNodes(graph[i]);
        }
        nodes = makeArrayUnique(nodes);
        //Build unique nodes
        for (var j in nodes) {
            var node = springyGraph.newNode({label: nodes[j]});
            nodesHash[nodes[j]] = node;
        }
        //Build edges
        for (var l in graph) {
            processLDObjectForEdges(graph[l]);
        }
        for (var k in edges) {
            var edge = springyGraph.newEdge(nodesHash[edges[k][0]], nodesHash[edges[k][1]], edges[k][2]);
        }
        springyGraph.addEdge(edge);
    }

    function processLDObjectForNodes(object) {
        for (var predicate in object) {
            var obj = object[predicate];
            nodes.push(object["@id"]);
            if (obj instanceof Object) {
                processLDObjectForNodes(obj);
            } else {
                nodes.push(obj);
            }
        }
    }

    function processLDObjectForEdges(object) {
        for (var predicate in object) {
            var obj = object[predicate];
            var subject = object["@id"];
            //Ignore node self-referencing
            if (predicate == '@id') {
                continue;
                //Recurse through nested object
            } else if (obj instanceof Object) {
                edges.push([subject, obj["@id"], {directional: true, label: predicate}]);
                processLDObjectForEdges(obj);
                continue;
            }
            edges.push([subject, obj, {directional: true, label: predicate}]);
        }
    }

    function makeArrayUnique(a, b, c) {
        b = a.length;
        while (c = --b) while (c--)a[b] !== a[c] || a.splice(c, 1);
        return a;
    }

    function displaySpringy() {
        $('#graph').springy({graph: springyGraph});
    }

};
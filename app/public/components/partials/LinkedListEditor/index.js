data = data.map(function (d, i) {
  return {
    id: i,
    value: d
  };
});

var bbox = params.viewport.node().getBBox();
var width = bbox.x;
var height = bbox.y;

    var node = params.viewport.selectAll('g')
      .data(data)
      .enter()
      .append('g');

    var circle = node.append('circle')
      .attr('class', params.dragClass)
      .attr('cx', function (d) { return (width / 2) + 100 * d.id; })
      .attr('cy', height / 2)
      .attr('r', '20');

    var label = node.append('text')
      .attr('class', params.dragClass)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('x', function (d) {
        return (width / 2) + 100 * d.id;
      })
      .attr('y', height / 2)
      .attr('fill', 'white')
      .text(function (d) {
        return d.value;
      });

  params.viewport.selectAll('line')
      .data(data.slice(0, data.length - 1))
      .enter()
      .append('line')
      .attr('class', params.dragClass)
      .attr('x1', function (d) {
        return (width / 2) + 100 * d.id + 10;
      })
      .attr('x2', function (d) {
        return (width / 2) + 100 * (d.id + 1) - 10;
      })
      .attr('y1', height / 2)
      .attr('y2', height / 2)
      .style('stroke', 'black')
      .style('stroke-width', '2');
 

define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants)
{
"use strict";

	function ArcClose2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ArcClose2D);
	}

	ArcClose2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: ArcClose2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "closureType", new Fields .SFString ("PIE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "startAngle",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "endAngle",    new Fields .SFFloat (1.5708)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",      new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",       new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "ArcClose2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
	});

	return ArcClose2D;
});



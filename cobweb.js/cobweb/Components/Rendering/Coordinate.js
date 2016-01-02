
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DCoordinateNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DCoordinateNode, 
          X3DConstants)
{
"use strict";

	function Coordinate (executionContext)
	{
		X3DCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Coordinate);
	}

	Coordinate .prototype = $.extend (Object .create (X3DCoordinateNode .prototype),
	{
		constructor: Coordinate,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new Fields .MFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "Coordinate";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "coord";
		},
	});

	return Coordinate;
});



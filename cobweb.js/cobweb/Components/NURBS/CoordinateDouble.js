
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

	function CoordinateDouble (executionContext)
	{
		X3DCoordinateNode .call (this, executionContext);

		this .addType (X3DConstants .CoordinateDouble);
	}

	CoordinateDouble .prototype = $.extend (Object .create (X3DCoordinateNode .prototype),
	{
		constructor: CoordinateDouble,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new Fields .MFVec3d ()),
		]),
		getTypeName: function ()
		{
			return "CoordinateDouble";
		},
		getComponentName: function ()
		{
			return "NURBS";
		},
		getContainerField: function ()
		{
			return "coord";
		},
	});

	return CoordinateDouble;
});




define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/NURBS/X3DParametricGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParametricGeometryNode, 
          X3DConstants)
{
"use strict";

	function NurbsSwungSurface (executionContext)
	{
		X3DParametricGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .NurbsSwungSurface);
	}

	NurbsSwungSurface .prototype = $.extend (Object .create (X3DParametricGeometryNode .prototype),
	{
		constructor: NurbsSwungSurface,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "profileCurve",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "trajectoryCurve", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "NurbsSwungSurface";
		},
		getComponentName: function ()
		{
			return "NURBS";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
	});

	return NurbsSwungSurface;
});



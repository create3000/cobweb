
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

	function NurbsCurve (executionContext)
	{
		X3DParametricGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .NurbsCurve);
	}

	NurbsCurve .prototype = $.extend (Object .create (X3DParametricGeometryNode .prototype),
	{
		constructor: NurbsCurve,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tessellation", new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",       new Fields .MFDouble ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "closed",       new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "knot",         new Fields .MFDouble ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "order",        new Fields .SFInt32 (3)),
		]),
		getTypeName: function ()
		{
			return "NurbsCurve";
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

	return NurbsCurve;
});



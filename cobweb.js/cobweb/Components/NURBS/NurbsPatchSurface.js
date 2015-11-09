
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/NURBS/X3DNurbsSurfaceGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNurbsSurfaceGeometryNode, 
          X3DConstants)
{
"use strict";

	function NurbsPatchSurface (executionContext)
	{
		X3DNurbsSurfaceGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .NurbsPatchSurface);
	}

	NurbsPatchSurface .prototype = $.extend (Object .create (X3DNurbsSurfaceGeometryNode .prototype),
	{
		constructor: NurbsPatchSurface,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "uTessellation", new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "vTessellation", new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "uClosed",       new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "vClosed",       new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",         new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "uOrder",        new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "vOrder",        new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "uDimension",    new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "vDimension",    new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "uKnot",         new Fields .MFDouble ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "vKnot",         new Fields .MFDouble ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",        new Fields .MFDouble ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint",  new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "NurbsPatchSurface";
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

	return NurbsPatchSurface;
});




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
	with (Fields)
	{
		function NurbsPatchSurface (executionContext)
		{
			X3DNurbsSurfaceGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsPatchSurface);
		}

		NurbsPatchSurface .prototype = $.extend (new X3DNurbsSurfaceGeometryNode (),
		{
			constructor: NurbsPatchSurface,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "uTessellation", new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "vTessellation", new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uClosed",       new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vClosed",       new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uOrder",        new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vOrder",        new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uDimension",    new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vDimension",    new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uKnot",         new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vKnot",         new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",        new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint",  new SFNode ()),
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
	}
});


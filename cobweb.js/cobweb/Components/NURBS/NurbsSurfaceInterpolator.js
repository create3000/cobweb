
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function NurbsSurfaceInterpolator (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsSurfaceInterpolator);
		}

		NurbsSurfaceInterpolator .prototype = $.extend (Object .create (X3DChildNode .prototype),
		{
			constructor: NurbsSurfaceInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_fraction",     new SFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",           new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "position_changed", new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "normal_changed",   new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uDimension",       new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uKnot",            new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uOrder",           new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vDimension",       new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vKnot",            new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vOrder",           new SFInt32 (3)),
			]),
			getTypeName: function ()
			{
				return "NurbsSurfaceInterpolator";
			},
			getComponentName: function ()
			{
				return "NURBS";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return NurbsSurfaceInterpolator;
	}
});


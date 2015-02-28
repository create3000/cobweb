
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
		function NurbsOrientationInterpolator (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsOrientationInterpolator);
		}

		NurbsOrientationInterpolator .prototype = $.extend (new X3DChildNode (),
		{
			constructor: NurbsOrientationInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "controlPoint",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "knot",          new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "order",         new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "weight",        new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new SFRotation ()),
			]),
			getTypeName: function ()
			{
				return "NurbsOrientationInterpolator";
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

		return NurbsOrientationInterpolator;
	}
});


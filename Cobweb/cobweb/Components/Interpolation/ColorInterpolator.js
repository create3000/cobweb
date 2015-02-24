
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ColorInterpolator (executionContext)
		{
			X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ColorInterpolator);
		}

		ColorInterpolator .prototype = $.extend (new X3DInterpolatorNode (),
		{
			constructor: ColorInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new MFColor ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new SFColor ()),
			]),
			getTypeName: function ()
			{
				return "ColorInterpolator";
			},
			getComponentName: function ()
			{
				return "Interpolation";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return ColorInterpolator;
	}
});


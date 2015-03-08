
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants,
          Vector3)
{
	with (Fields)
	{
		function PositionInterpolator (executionContext)
		{
			X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PositionInterpolator);
		}

		PositionInterpolator .prototype = $.extend (new X3DInterpolatorNode (),
		{
			constructor: PositionInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new SFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "PositionInterpolator";
			},
			getComponentName: function ()
			{
				return "Interpolation";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DInterpolatorNode .prototype .initialize .call (this);

				this .keyValue_ .addInterest (this, "set_keyValue__");
			},
			set_keyValue__: function ()
			{
				if (this .keyValue_ .length < this .key_ .length)
					this .keyValue_ .resize (this .key_ .length, this .keyValue_ .length ? this .keyValue_ [this .keyValue_ .length - 1] : new SFVec3f ());
			},
			interpolate: function (index0, index1, weight)
			{
				this .value_changed_ = Vector3 .lerp (this .keyValue_ [index0] .getValue (), this .keyValue_ [index1] .getValue (), weight);
			},
		});

		return PositionInterpolator;
	}
});


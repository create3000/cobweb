
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants,
          Algorithm)
{
	with (Fields)
	{
		function ScalarInterpolator (executionContext)
		{
			X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ScalarInterpolator);
		}

		ScalarInterpolator .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
		{
			constructor: ScalarInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new SFFloat ()),
			]),
			getTypeName: function ()
			{
				return "ScalarInterpolator";
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
				var
					key      = this .key_,
					keyValue = this .keyValue_;

				if (keyValue .length < key .length)
					keyValue .resize (key .length, keyValue .length ? keyValue [keyValue .length - 1] : 0);
			},
			interpolate: function (index0, index1, weight)
			{
				this .value_changed_ = Algorithm .lerp (this .keyValue_ [index0], this .keyValue_ [index1], weight);
			},
		});

		return ScalarInterpolator;
	}
});


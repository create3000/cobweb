
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants,
          Vector3,
          Algorithm)
{
	with (Fields)
	{
		function NormalInterpolator (executionContext)
		{
			X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NormalInterpolator);
		}

		NormalInterpolator .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
		{
			constructor: NormalInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new MFVec3f ()),
			]),
			keyValue: new Vector3 (0, 0, 0),
			getTypeName: function ()
			{
				return "NormalInterpolator";
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
			set_keyValue__: function () { },
			interpolate: function (index0, index1, weight)
			{
				var
					keyValue      = this .keyValue_ .getValue (),
					value_changed = this .value_changed_ .getValue (),
					size          = this .key_ .length > 1 ? Math .floor (keyValue .length / this .key_ .length) : 0;

				index0 *= size;
				index1  = index0 + size;

				this .value_changed_ .length = size;

				for (var i = 0; i < size; ++ i)
				{
					value_changed [i] .set (this .keyValue .assign (keyValue [index0 + i] .getValue ())
					                                       .slerp (keyValue [index1 + i] .getValue (),
					                                               weight));
				}

				this .value_changed_ .addEvent ();
			},
		});

		return NormalInterpolator;
	}
});


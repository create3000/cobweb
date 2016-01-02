
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Browser/Interpolation/SquatInterpolator",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode,
          SquatInterpolator,
          X3DConstants)
{
"use strict";

	function SquadOrientationInterpolator (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .SquadOrientationInterpolator);

		this .squad = new SquatInterpolator ();
	}

	SquadOrientationInterpolator .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
	{
		constructor: SquadOrientationInterpolator,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "closed",        new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new Fields .MFRotation ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new Fields .SFRotation ()),
		]),
		getTypeName: function ()
		{
			return "SquadOrientationInterpolator";
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
		
			this .keyValue_    .addInterest (this, "set_keyValue__");
		},
		set_keyValue__: function ()
		{
			var
				key      = this .key_,
				keyValue = this .keyValue_;

			if (keyValue .length < key .length)
				keyValue .resize (key .length, keyValue .length ? keyValue [keyValue .length - 1] : new Fields .SFRotation ());

			this .squad .generate (this .closed_   .getValue (),
			                       this .key_      .getValue (),
			                       this .keyValue_ .getValue ());
		},
		interpolate: function (index0, index1, weight)
		{
			try
			{
				this .value_changed_ = this .squad .interpolate (index0, index1, weight, this .keyValue_ .getValue ());
			}
			catch (error)
			{
				console .log (error);
			}
		},
	});

	return SquadOrientationInterpolator;
});



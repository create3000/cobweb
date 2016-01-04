
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants,
          Vector2)
{
"use strict";

	var
		a      = new Vector2 (0, 0),
		vector = new Vector2 (0, 0),
		array  = new Fields .MFVec2f ();

	function TexCoordDamper2D (executionContext)
	{
		X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .TexCoordDamper2D);
	}

	TexCoordDamper2D .prototype = $.extend (Object .create (X3DDamperNode .prototype),
	{
		constructor: TexCoordDamper2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new Fields .SFTime (0.3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new Fields .SFFloat (-1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .MFVec2f ()),
		]),
		getTypeName: function ()
		{
			return "TexCoordDamper2D";
		},
		getComponentName: function ()
		{
			return "Followers";
		},
		getContainerField: function ()
		{
			return "children";
		},
		getVector: function ()
		{
			return new Fields .MFVec2f ();
		},
		getValue: function ()
		{
			return this .set_value_;
		},
		getDestination: function ()
		{
			return this .set_destination_;
		},
		getInitialValue: function ()
		{
			return this .initialValue_;
		},
		getInitialDestination: function ()
		{
			return this .initialDestination_;
		},
		assign: function (buffer, i, value)
		{
			buffer [i] .setValue (value);
		},
		equals: function (lhs, rhs, tolerance)
		{
			var
				l        = lhs .getValue (),
				r        = rhs .getValue (),
				distance = 0;

			for (var i = 0, length = l .length; i < length; ++ i)
			  distance = Math .max (a .assign (l [i] .getValue ()) .subtract (r [i] .getValue ()) .abs ());

			return distance < tolerance;
		},
		interpolate: function (source, destination, weight)
		{
			var
				a = array .getValue (),
				s = source .getValue (),
				d = destination .getValue ();

			array .length = s .length;

			for (var i = 0, length = s .length; i < length; ++ i)
				a [i] .getValue () .assign (s [i] .getValue ()) .lerp (d [i] .getValue (), weight);

			return array;
		},
		set_value__: function ()
		{
			this .getBuffer () [0] .length = this .set_value_ .length;

			X3DDamperNode .prototype .set_value__ .call (this);
		},
		set_destination__: function ()
		{
			var
				buffer = this .getBuffer (),
				l      = this .set_destination_ .length;

			for (var i = 1, length = buffer .length; i < length; ++ i)
				buffer [i] .length = l;
			
			X3DDamperNode .prototype .set_destination__ .call (this);
		},
	});

	return TexCoordDamper2D;
});



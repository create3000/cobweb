
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	var
		a      = new Vector3 (0, 0),
		vector = new Vector3 (0, 0),
		array  = new Fields .MFVec3f ();

	function CoordinateDamper (executionContext)
	{
		X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .CoordinateDamper);
	}

	CoordinateDamper .prototype = $.extend (Object .create (X3DDamperNode .prototype),
	{
		constructor: CoordinateDamper,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .MFVec3f (new Vector3 (0, 0, 0))),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .MFVec3f (new Vector3 (0, 0, 0))),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new Fields .SFTime (0.3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new Fields .SFFloat (-1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .MFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "CoordinateDamper";
		},
		getComponentName: function ()
		{
			return "Followers";
		},
		getContainerField: function ()
		{
			return "children";
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

	return CoordinateDamper;
});



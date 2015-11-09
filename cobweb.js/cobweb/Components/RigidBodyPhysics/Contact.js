
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DConstants)
{
"use strict";

	function Contact (executionContext)
	{
		X3DNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Contact);
	}

	Contact .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: Contact,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                 new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "appliedParameters",        new Fields .MFString ("BOUNCE")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "body1",                    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "body2",                    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "bounce",                   new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "contactNormal",            new Fields .SFVec3f (0, 1, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "depth",                    new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "frictionCoefficients",     new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "frictionDirection",        new Fields .SFVec3f (0, 1, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "geometry1",                new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "geometry2",                new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "minbounceSpeed",           new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "position",                 new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "slipCoefficients",         new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "softnessConstantForceMix", new Fields .SFFloat (0.0001)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "softnessErrorCorrection",  new Fields .SFFloat (0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "surfaceSpeed",             new Fields .SFVec2f ()),
		]),
		getTypeName: function ()
		{
			return "Contact";
		},
		getComponentName: function ()
		{
			return "RigidBodyPhysics";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return Contact;
});



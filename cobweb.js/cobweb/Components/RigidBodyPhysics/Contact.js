
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
	with (Fields)
	{
		function Contact (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Contact);
		}

		Contact .prototype = $.extend (Object .create (X3DNode .prototype),
		{
			constructor: Contact,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                 new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "appliedParameters",        new MFString ("BOUNCE")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body1",                    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "body2",                    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "bounce",                   new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "contactNormal",            new SFVec3f (0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "depth",                    new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "frictionCoefficients",     new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "frictionDirection",        new SFVec3f (0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "geometry1",                new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "geometry2",                new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "minbounceSpeed",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "position",                 new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "slipCoefficients",         new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "softnessConstantForceMix", new SFFloat (0.0001)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "softnessErrorCorrection",  new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "surfaceSpeed",             new SFVec2f (0, 0)),
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
	}
});


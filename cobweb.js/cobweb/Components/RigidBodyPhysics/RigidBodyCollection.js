
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
		function RigidBodyCollection (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .RigidBodyCollection);
		}

		RigidBodyCollection .prototype = $.extend (Object .create (X3DChildNode .prototype),
		{
			constructor: RigidBodyCollection,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",                new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_contacts",            new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "autoDisable",             new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "bodies",                  new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "constantForceMix",        new SFFloat (0.0001)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "contactSurfaceThickness", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "disableAngularSpeed",     new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "disableLinearSpeed",      new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "disableTime",             new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",                 new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "errorCorrection",         new SFFloat (0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "gravity",                 new SFVec3f (0, -9.8, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "iterations",              new SFInt32 (10)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "joints",                  new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxCorrectionSpeed",      new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "preferAccuracy",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "collider",                new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "RigidBodyCollection";
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

		return RigidBodyCollection;
	}
});


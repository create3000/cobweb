
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
		function CollisionCollection (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CollisionCollection);
		}

		CollisionCollection .prototype = $.extend (Object .create (X3DChildNode .prototype),
		{
			constructor: CollisionCollection,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                 new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "appliedParameters",        new MFString ("BOUNCE")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "bounce",                   new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "collidables",              new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",                  new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "frictionCoefficients",     new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "minBounceSpeed",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "slipFactors",              new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "softnessConstantForceMix", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "softnessErrorCorrection",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "surfaceSpeed",             new SFVec2f (0, 0)),
			]),
			getTypeName: function ()
			{
				return "CollisionCollection";
			},
			getComponentName: function ()
			{
				return "RigidBodyPhysics";
			},
			getContainerField: function ()
			{
				return "collidables";
			},
		});

		return CollisionCollection;
	}
});


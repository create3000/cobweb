
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
"use strict";

	function CollisionCollection (executionContext)
	{
		X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .CollisionCollection);
	}

	CollisionCollection .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: CollisionCollection,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                 new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "appliedParameters",        new Fields .MFString ("BOUNCE")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "bounce",                   new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "collidables",              new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",                  new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "frictionCoefficients",     new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "minBounceSpeed",           new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "slipFactors",              new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "softnessConstantForceMix", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "softnessErrorCorrection",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "surfaceSpeed",             new Fields .SFVec2f ()),
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
});



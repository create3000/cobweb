
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticlePhysicsModelNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Bits/X3DCast",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticlePhysicsModelNode, 
          X3DConstants,
          X3DCast)
{
"use strict";

	function BoundedPhysicsModel (executionContext)
	{
		X3DParticlePhysicsModelNode .call (this, executionContext);

		this .addType (X3DConstants .BoundedPhysicsModel);
	}

	BoundedPhysicsModel .prototype = $.extend (Object .create (X3DParticlePhysicsModelNode .prototype),
	{
		constructor: BoundedPhysicsModel,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "geometry", new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "BoundedPhysicsModel";
		},
		getComponentName: function ()
		{
			return "ParticleSystems";
		},
		getContainerField: function ()
		{
			return "physics";
		},
		initialize: function ()
		{
			X3DParticlePhysicsModelNode .prototype .initialize .call (this);

			this .geometry_ .addInterest (this, "set_geometry__");

			this .set_geometry__ ();
		},
		set_geometry__: function ()
		{
			if (this .geometryNode)
				this .geometryNode .removeInterest (this, "addNodeEvent");

			this .geometryNode = X3DCast (X3DConstants .X3DGeometryNode, this .geometry_);

			if (this .geometryNode)
				this .geometryNode .addInterest (this, "addNodeEvent");
		},
		addGeometry: function (boundedNormals, boundedVertices)
		{
			if (this .geometryNode)
			{
				var
					normals  = this .geometryNode .getNormals (),
					vertices = this .geometryNode .getVertices ();
	
				for (var i = 0, length = normals .length; i < length; ++ i)
					boundedNormals .push (normals [i]);
	
				for (var i = 0, length = vertices .length; i < length; ++ i)
					boundedVertices .push (vertices [i]);
			}
		},
	});

	return BoundedPhysicsModel;
});



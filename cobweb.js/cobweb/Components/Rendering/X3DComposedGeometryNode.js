
define ([
	"jquery",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DGeometryNode,
          X3DCast,
          X3DConstants,
          Vector3)
{
"use strict";

	function X3DComposedGeometryNode (browser, executionContext)
	{
		X3DGeometryNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DComposedGeometryNode);

		this .attribNodes  = [ ];
		this .colorNode    = null;
		this .texCoordNode = null;
		this .normalNode   = null;
		this .coordNode    = null;
	}

	X3DComposedGeometryNode .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: X3DComposedGeometryNode,
		initialize: function ()
		{
			X3DGeometryNode .prototype .initialize .call (this);

			this .attrib_   .addInterest (this, "set_attrib__");
			this .color_    .addInterest (this, "set_color__");
			this .texCoord_ .addInterest (this, "set_texCoord__");
			this .normal_   .addInterest (this, "set_normal__");
			this .coord_    .addInterest (this, "set_coord__");

			this .set_attrib__ ();
			this .set_color__ ();
			this .set_texCoord__ ();
			this .set_normal__ ();
			this .set_coord__ ();
		},
		getAttrib: function ()
		{
			return this .attribNodes;
		},
		getColor: function ()
		{
			return this .colorNode;
		},
		getTexCoord: function ()
		{
			return this .texCoordNode;
		},
		getNormal: function ()
		{
			return this .normalNode;
		},
		getCoord: function ()
		{
			return this .coordNode;
		},
		set_attrib__: function ()
		{
			for (var i = 0; i < this .attribNodes .length; ++ i)
				this .attribNodes [i] .removeInterest (this, "addNodeEvent");

			this .attribNodes .length = 0;

			for (var i = 0, length = this .attrib_ .length; i < length; ++ i)
			{
				var attribNode = X3DCast (X3DConstants .X3DVertexAttributeNode, this .attrib_ [i]);

				if (attribNode)
					this .attribNodes .push (attribNode);
			}

			for (var i = 0; i < this .attribNodes .length; ++ i)
				this .attribNodes [i] .addInterest (this, "addNodeEvent");
		},
		set_color__: function ()
		{
			if (this .colorNode)
			{
				this .colorNode .removeInterest (this, "addNodeEvent");
				this .colorNode .removeInterest (this, "set_transparent__");
			}

			this .colorNode = X3DCast (X3DConstants .X3DColorNode, this .color_);

			if (this .colorNode)
			{
				this .colorNode .addInterest (this, "addNodeEvent");
				this .colorNode .addInterest (this, "set_transparent__");

				this .set_transparent__ ();
			}
			else
				this .transparent_ = false;
		},
		set_transparent__: function ()
		{
			this .transparent_ = this .colorNode .isTransparent ();
		},
		set_texCoord__: function ()
		{
			if (this .texCoordNode)
				this .texCoordNode .removeInterest (this, "addNodeEvent");

			this .texCoordNode = X3DCast (X3DConstants .X3DTextureCoordinateNode, this .texCoord_);

			if (this .texCoordNode)
				this .texCoordNode .addInterest (this, "addNodeEvent");
		},
		set_normal__: function ()
		{
			if (this .normalNode)
				this .normalNode .removeInterest (this, "addNodeEvent");

			this .normalNode = X3DCast (X3DConstants .X3DNormalNode, this .normal_);

			if (this .normalNode)
				this .normalNode .addInterest (this, "addNodeEvent");
		},
		set_coord__: function ()
		{
			if (this .coordNode)
				this .coordNode .removeInterest (this, "addNodeEvent");

			this .coordNode = X3DCast (X3DConstants .X3DCoordinateNode, this .coord_);

			if (this .coordNode)
				this .coordNode .addInterest (this, "addNodeEvent");
		},
		getIndex: function (index)
		{
			return index;
		},
		build: function (vertexCount, size)
		{
			if (! this .coordNode || this .coordNode .isEmpty ())
				return;
		
			// Set size to a multiple of vertexCount.
		
			size -= size % vertexCount;
		
			var
				colorPerVertex  = this .colorPerVertex_ .getValue (),
				normalPerVertex = this .normalPerVertex_ .getValue (),
				colorNode       = this .getColor (),
				texCoordNode    = this .getTexCoord (),
				normalNode      = this .getNormal (),
				coordNode       = this .getCoord (),
				textCoords      = this .getTexCoords (),
				triangle        = [ ];

			if (texCoordNode)
				texCoordNode .init (textCoords);
		
			// Fill GeometryNode
		
			for (var i = 0, face = 0; i < size; ++ face, i += vertexCount)
			{
				triangle [0] = i;

				for (var t = 1, c = vertexCount - 1; t < c; ++ t)
				{
					triangle [1] = i + t;
					triangle [2] = i + t + 1;

					for (var v = 0; v < 3; ++ v)
					{
						var index = this .getIndex (triangle [v]);
			
						if (colorNode)
						{
							if (colorPerVertex)
								this .addColor (colorNode .getColor (index));
							else
								this .addColor (colorNode .getColor (face));
						}
	
						if (texCoordNode)
							texCoordNode .addTexCoord (textCoords, index);
			
						if (normalNode)
						{
							if (normalPerVertex)
								this .addNormal (normalNode .getVector (index));
	
							else
								this .addNormal (normalNode .getVector (face));
						}
	
						this .addVertex (coordNode .getPoint (index));
					}
				}
			}
		
			// Autogenerate normal if not specified.

			if (! this .getNormal ())
				this .buildNormals (vertexCount, size);

			this .setSolid (this .solid_ .getValue ());
			this .setCCW (this .ccw_ .getValue ());
			this .setCurrentTexCoord (this .getTexCoord ());
		},
		buildNormals: function (vertexCount, size)
		{
			var normals = this .createNormals (vertexCount, size);

			for (var i = 0; i < size; i += vertexCount)
			{
				for (var t = 1, c = vertexCount - 1; t < c; ++ t)
				{
					this .addNormal (normals [i]);
					this .addNormal (normals [i + t]);
					this .addNormal (normals [i + t + 1]);
				}
			}
		},
		createNormals: function (vertexCount, size)
		{
			var normals = this .createFaceNormals (vertexCount, size);
		
			if (this .normalPerVertex_ .getValue ())
			{
				var normalIndex = [ ];
		
				for (var i = 0; i < size; ++ i)
				{
					var index = this .getIndex (i);

					if (! normalIndex [index])
						normalIndex [index] = [ ];

					normalIndex [index] .push (i);
				}

				return this .refineNormals (normalIndex, normals, Math .PI);
			}
		
			return normals;
		},
		createFaceNormals: function (vertexCount, size)
		{
			var normals = [ ];

			for (var index = 0; index < size; index += vertexCount)
			{
				var normal = new Vector3 (0, 0, 0);

				for (var i = 1, l = vertexCount - 1; i < l; ++ i)
				{
					normal .add (this .coordNode .getNormal (this .getIndex (index),
					                                         this .getIndex (index + i),
					                                         this .getIndex (index + i + 1)));
				}

				normal .normalize ();

				for (var i = 0; i < vertexCount; ++ i)
					normals .push (normal);
			}

			return normals;
		},
	});

	return X3DComposedGeometryNode;
});



/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the Cobweb Project.
 *
 * Cobweb is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * Cobweb is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with Cobweb.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
	"jquery",
	"../Fields.js",
	"./X3DExecutionContext.js",
	"../Configuration/UnitInfo.js",
	"../Configuration/UnitInfoArray.js",
	"./ExportedNode.js",
	"../Bits/X3DConstants.js",
	"../InputOutput/Generator.js",
],
function ($,
          Fields,
          X3DExecutionContext,
          UnitInfo,
          UnitInfoArray,
          ExportedNode,
          X3DConstants,
          Generator)
{
"use strict";

	function X3DScene (executionContext)
	{
		X3DExecutionContext .call (this, executionContext);

		this .getRootNodes () .setAccessType (X3DConstants .inputOutput);

		this .units = new UnitInfoArray ();

		this .units .add ("angle",  new UnitInfo ("angle",  "radian",   1));
		this .units .add ("force",  new UnitInfo ("force",  "newton",   1));
		this .units .add ("length", new UnitInfo ("length", "metre",    1));
		this .units .add ("mass",   new UnitInfo ("mass",   "kilogram", 1));

		this .metaData      = { };
		this .exportedNodes = { };

		this .setLive (false);
	}

	X3DScene .prototype = $.extend (Object .create (X3DExecutionContext .prototype),
	{
		constructor: X3DScene,
		isMasterContext: function ()
		{
			return this === this .getExecutionContext ();
		},
		isRootContext: function ()
		{
			return true;
		},
		getScene: function ()
		{
			if (this .isMasterContext ())
				return this;

			return this .getExecutionContext () .getScene ();
		},
		updateUnit: function (category, name, conversionFactor)
		{
			var unit = this .units .get (category);

			if (! unit)
				return;

			unit .name             = name;
			unit .conversionFactor = conversionFactor;
		},
		getUnits: function ()
		{
			return this .units;
		},
		setMetaData: function (name, value)
		{
			if (! name .length)
				return;

			this .metaData [name] = String (value);
		},
		getMetaData: function (name)
		{
			return this .metaData [name];
		},
		getMetaDatas: function ()
		{
			return this .metaData;
		},
		addExportedNode: function (exportedName, node)
		{
			if (this .exportedNodes [exportedName])
				throw new Error ("Couldn't add exported node: exported name '" + exportedName + "' already in use.");

			this .updateExportedNode (exportedName, node);
		},
		updateExportedNode: function (exportedName, node)
		{
			exportedName = String (exportedName);

			if (exportedName .length === 0)
				throw new Error ("Couldn't update exported node: node exported name is empty.");

			if (! (node instanceof Fields .SFNode))
				throw new Error ("Couldn't update exported node: node must be of type SFNode.");

			if (! node .getValue ())
				throw new Error ("Couldn't update exported node: node IS NULL.");

			//if (node .getValue () .getExecutionContext () !== this)
			//	throw new Error ("Couldn't update exported node: node does not belong to this execution context.");

			this .exportedNodes [exportedName] = new ExportedNode (exportedName, node .getValue ());
		},
		removeExportedNode: function (exportedName)
		{
			delete this .exportedNodes [exportedName];
		},
		getExportedNode: function (exportedName)
		{
			var exportedNode = this .exportedNodes [exportedName];

			if (exportedNode)
				return exportedNode .getLocalNode ();	

			throw new Error ("Exported node '" + exportedName + "' not found.");
		},
		getExportedNodes: function ()
		{
			return this .exportedNodes;
		},
		addRootNode: function (node)
		{
			if (! (node instanceof Fields .SFNode || node === null))
				throw new Error ("Couldn't add root node: node must be of type SFNode.");

			//if (node && node .getValue () && node .getValue () .getExecutionContext () !== this)
			//	throw new Error ("Couldn't add root node: node does not belong to this execution context.");

			this .getRootNodes () .push (node);
		},
		removeRootNode: function (node)
		{
			if (! (node instanceof Fields .SFNode || node === null))
				throw new Error ("Couldn't remove root node: node must be of type SFNode.");

			var
				rootNodes = this .getRootNodes (),
				length    = rootNodes .length;

			rootNodes .erase (rootNodes .remove (0, length, node), length);
		},
		setRootNodes: function (value)
		{
			this .getRootNodes () .setValue (value);
		},
		toXMLStream: function (stream)
		{
			var specificationVersion = this .getSpecificationVersion ();

			if (specificationVersion === "2.0")
				specificationVersion = "3.3";
		
			stream .string += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
			stream .string += "<!DOCTYPE X3D PUBLIC \"ISO//Web3D//DTD X3D ";
			stream .string += specificationVersion;
			stream .string += "//EN\" \"http://www.web3d.org/specifications/x3d-";
			stream .string += specificationVersion;
			stream .string += ".dtd\">\n";
		
			stream .string += "<X3D";
			stream .string += " ";
			stream .string += "profile='";
			stream .string += this .getProfile () ? this .getProfile () .name : "Full";
			stream .string += "'";
			stream .string += " ";
			stream .string += "version='";
			stream .string += specificationVersion;
			stream .string += "'";
			stream .string += " ";
			stream .string += "xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance'";
			stream .string += " ";
			stream .string += "xsd:noNamespaceSchemaLocation='http://www.web3d.org/specifications/x3d-";
			stream .string += specificationVersion;
			stream .string += ".xsd'>\n";

			Generator .IncIndent ();

			stream .string += Generator .Indent ();
			stream .string += "<head>\n";

			Generator .IncIndent ();
		
			// <head>

			this .getComponents () .toXMLStream (stream);

			var units = this .getUnits ();

			for (var i = 0, length = units .length; i < length; ++ i)
			{
				var unit = units [i];

				if (unit .conversionFactor !== 1)
				{
					unit .toXMLStream (stream);

					stream .string += "\n";
				}
			}
		
			var metaDatas = this .getMetaDatas ();

			for (var key in metaDatas)
			{
				stream .string += Generator .Indent ();
				stream .string += "<meta";
				stream .string += " ";
				stream .string += "name='";
				stream .string += Generator .XMLEncode (key);
				stream .string += "'";
				stream .string += " ";
				stream .string += "content='";
				stream .string += Generator .XMLEncode (metaDatas [key]);
				stream .string += "'";
				stream .string += "/>\n";
			}
		
			// </head>

			Generator .DecIndent ();

			stream .string += Generator .Indent ();
			stream .string += "</head>\n";
			stream .string += Generator .Indent ();
			stream .string += "<Scene>\n";

			Generator .IncIndent ();
		
			// <Scene>

			var exportedNodes = this .getExportedNodes ();

			Generator .PushExecutionContext (this);
			Generator .EnterScope ();
			Generator .ExportedNodes (exportedNodes);

			X3DExecutionContext .prototype .toXMLStream .call (this, stream);
		
			for (var exportedName in exportedNodes)
			{
				//try
				{
					exportedNodes [exportedName] .toXMLStream (stream);

					stream .string += "\n";
				}
				//catch (const X3DError &)
				{ }
			}

			Generator .LeaveScope ();
			Generator .PopExecutionContext ();

			// </Scene>

			Generator .DecIndent ();

			stream .string += Generator .Indent ();
			stream .string += "</Scene>\n";

			Generator .DecIndent ();

			stream .string += "</X3D>\n";
		},
	});

	return X3DScene;
});
